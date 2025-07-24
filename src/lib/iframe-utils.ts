/**
 * Utilidades para manejo de iframes en autenticación 3DS
 */

/**
 * Carga contenido HTML en un iframe
 * @param iframeElement - Referencia al elemento iframe
 * @param htmlContent - Contenido HTML a cargar
 * @returns Promise que se resuelve cuando el contenido se carga o rechaza en caso de error
 */
export function loadHtmlIntoIframe(
  iframeElement: HTMLIFrameElement | null,
  htmlContent: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!iframeElement || !htmlContent) {
      reject(new Error("Iframe no disponible o contenido HTML vacío"));
      return;
    }

    try {
      console.log("Cargando HTML en iframe");

      // Usar setTimeout para asegurar que el iframe esté listo
      setTimeout(() => {
        if (!iframeElement) {
          reject(new Error("Iframe no disponible"));
          return;
        }

        const doc =
          iframeElement.contentDocument ||
          iframeElement.contentWindow?.document;

        if (doc) {
          doc.open();
          doc.write(htmlContent);
          doc.close();
          console.log("HTML cargado correctamente en iframe");
          resolve(true);
        } else {
          console.error("No se pudo acceder al documento del iframe");
          reject(new Error("No se pudo acceder al documento del iframe"));
        }
      }, 100);
    } catch (error) {
      console.error("Error al renderizar HTML en iframe:", error);
      reject(error);
    }
  });
}
