import jsPDF from 'jspdf'
import { Story } from './types'

// Cache the font so we only fetch it once
let cachedFontBase64: string | null = null

/**
 * Fetches a Cyrillic-supporting font (Roboto) and registers it with jsPDF.
 * Required because jsPDF's built-in helvetica doesn't support Cyrillic characters.
 */
async function registerCyrillicFont(pdf: jsPDF): Promise<void> {
    if (!cachedFontBase64) {
        // Fetch Roboto Regular TTF from Google Fonts CDN
        const fontUrl = 'https://fonts.gstatic.com/s/roboto/v47/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbGmT.ttf'
        const response = await fetch(fontUrl)
        const buffer = await response.arrayBuffer()

        // Convert ArrayBuffer to base64 string
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        cachedFontBase64 = btoa(binary)
    }

    // Register font with jsPDF
    pdf.addFileToVFS('Roboto-Regular.ttf', cachedFontBase64)
    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
    pdf.setFont('Roboto', 'normal')
}

/**
 * Loads an image from a URL and returns it as a base64 data URL.
 */
async function loadImageAsBase64(url: string): Promise<string | null> {
    try {
        if (url.startsWith('data:')) return url

        const response = await fetch(url)
        const blob = await response.blob()
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => resolve(null)
            reader.readAsDataURL(blob)
        })
    } catch {
        return null
    }
}

/**
 * Exports a Story as a landscape picture-book PDF.
 * Layout: illustration on left half, text on right half.
 */
export async function exportStoryAsPdf(story: Story): Promise<void> {
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    })

    // Register Cyrillic font FIRST
    await registerCyrillicFont(pdf)

    const pageW = 297 // A4 landscape width
    const pageH = 210 // A4 landscape height
    const halfW = pageW / 2
    const margin = 12

    // ──────────────── COVER PAGE ────────────────
    pdf.setFillColor(124, 58, 237)
    pdf.rect(0, 0, pageW, pageH, 'F')

    // Pink accent circle
    pdf.setFillColor(236, 72, 153)
    pdf.circle(pageW / 2, pageH * 0.4, 45, 'F')
    pdf.setFillColor(124, 58, 237)
    pdf.circle(pageW / 2, pageH * 0.4, 40, 'F')

    // MediTale badge
    pdf.setFont('Roboto', 'normal')
    pdf.setFontSize(14)
    pdf.setTextColor(255, 255, 255)
    pdf.text('Siqyrly Oqiga', pageW / 2, pageH * 0.22, { align: 'center' })

    // Title
    pdf.setFontSize(32)
    const titleLines = pdf.splitTextToSize(story.title, pageW - 80)
    pdf.text(titleLines, pageW / 2, pageH * 0.42, { align: 'center' })

    // Subtitle
    pdf.setFontSize(16)
    pdf.text('A personalized story for', pageW / 2, pageH * 0.6, { align: 'center' })

    // Child name
    pdf.setFontSize(28)
    pdf.text(story.child_name, pageW / 2, pageH * 0.7, { align: 'center' })

    // ──────────────── SCENE PAGES ────────────────
    for (let i = 0; i < story.chapters.length; i++) {
        const chapter = story.chapters[i]
        pdf.addPage('a4', 'landscape')

        // Light background
        pdf.setFillColor(248, 246, 255)
        pdf.rect(0, 0, pageW, pageH, 'F')

        // Re-set font after addPage
        pdf.setFont('Roboto', 'normal')

        // ── LEFT HALF: Illustration ──
        if (chapter.illustration_url) {
            const imgData = await loadImageAsBase64(chapter.illustration_url)
            if (imgData) {
                try {
                    pdf.addImage(imgData, 'PNG', 0, 0, halfW, pageH)
                } catch (e) {
                    console.warn(`Failed to add illustration ${i + 1}:`, e)
                    drawPlaceholder(pdf, halfW, pageH, i)
                }
            } else {
                drawPlaceholder(pdf, halfW, pageH, i)
            }
        } else {
            drawPlaceholder(pdf, halfW, pageH, i)
        }

        // ── RIGHT HALF: Text ──
        const textW = halfW - margin * 2
        let yPos = pageH * 0.3

        // Scene text — large, centered
        pdf.setFontSize(22)
        pdf.setTextColor(40, 40, 40)
        const textLines = pdf.splitTextToSize(chapter.text, textW)
        pdf.text(textLines, halfW + halfW / 2, yPos, { align: 'center' })
        yPos += textLines.length * 10 + 15

        // Dialog
        if (chapter.dialog) {
            pdf.setFontSize(16)
            pdf.setTextColor(100, 100, 100)
            const dialogText = chapter.dialog.replace(/\n/g, ' ')
            const dialogLines = pdf.splitTextToSize(dialogText, textW)
            pdf.text(dialogLines, halfW + halfW / 2, yPos, { align: 'center' })
        }

        // Page number
        pdf.setFontSize(10)
        pdf.setTextColor(180, 180, 180)
        pdf.text(`${i + 1}`, pageW - margin, pageH - 8, { align: 'right' })
    }

    // ──────────────── DOCTOR'S NOTE PAGE ────────────────
    if (story.medical_note) {
        pdf.addPage('a4', 'landscape')
        pdf.setFont('Roboto', 'normal')

        pdf.setFillColor(240, 249, 255)
        pdf.rect(0, 0, pageW, pageH, 'F')

        // Title
        pdf.setFontSize(26)
        pdf.setTextColor(31, 41, 55)
        pdf.text("Doctor's Note", pageW / 2, 55, { align: 'center' })

        pdf.setFontSize(12)
        pdf.setTextColor(156, 163, 175)
        pdf.text('For parents and caregivers', pageW / 2, 65, { align: 'center' })

        // Note box
        const boxW = pageW - 80
        const noteLines = pdf.splitTextToSize(story.medical_note, boxW - 30)
        const boxH = noteLines.length * 7 + 24
        const boxX = 40
        const boxY = 78

        pdf.setFillColor(255, 255, 255)
        pdf.setDrawColor(191, 219, 254)
        pdf.setLineWidth(0.5)
        pdf.roundedRect(boxX, boxY, boxW, boxH, 5, 5, 'FD')

        pdf.setFontSize(13)
        pdf.setTextColor(55, 65, 81)
        pdf.text(noteLines, boxX + 15, boxY + 14)
    }

    // ──────────────── SAVE ────────────────
    const safeName = story.title.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s]/g, '').trim().replace(/\s+/g, '_').substring(0, 30)
    pdf.save(`${story.child_name}_${safeName}.pdf`)
}

/** Draws a placeholder when no illustration is available */
function drawPlaceholder(pdf: jsPDF, width: number, height: number, index: number) {
    pdf.setFillColor(237, 233, 254)
    pdf.rect(0, 0, width, height, 'F')
    const emojis = ['🏰', '🌈', '🦁', '⭐', '🌟', '🐻', '🌺', '🎨']
    pdf.setFontSize(50)
    pdf.setTextColor(167, 139, 250)
    pdf.text(emojis[index % emojis.length], width / 2, height / 2, { align: 'center' })
}
