import * as pdfjs from 'pdfjs-dist';

/**
 * Generates a thumbnail image (base64) from a PDF blob
 */
export const generateThumbnail = async (pdfBlob: Blob): Promise<string> => {
    try {
        // Ensure worker is set up
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
            const workerUrl = new URL(
                'pdfjs-dist/build/pdf.worker.min.mjs',
                import.meta.url
            ).toString();
            console.log('PDF.js Worker URL:', workerUrl);
            pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        }

        const arrayBuffer = await pdfBlob.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        // Get the first page
        const page = await pdf.getPage(1);

        // Set scale for thumbnail
        const scale = 0.5;
        const viewport = page.getViewport({ scale });

        // Prepare canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
        }).promise;

        // Convert canvas to base64 JPEG (smaller than PNG)
        return canvas.toDataURL('image/jpeg', 0.7);
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
};
