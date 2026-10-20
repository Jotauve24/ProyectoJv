const MAX_BYTES = 8 * 1024 * 1024;
export async function POST(request: Request) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return new Response('Origen no permitido', {status:403});
  const size = Number(request.headers.get('Content-Length') || 0);
  if (size > MAX_BYTES * 1.4) return new Response('Informe demasiado grande', {status:413});
  try {
    const form = await request.formData();
    const encoded = form.get('pdf');
    if (typeof encoded !== 'string' || encoded.length > MAX_BYTES * 1.4 || !/^[A-Za-z0-9+/=]+$/.test(encoded)) return new Response('Informe no válido', {status:400});
    const binary = atob(encoded);
    if (!binary.startsWith('%PDF-') || binary.length > MAX_BYTES) return new Response('PDF no válido', {status:400});
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const filename = String(form.get('filename') || 'Evidencia_ProyectoJv.pdf').replace(/[^a-zA-Z0-9_.-]/g,'_').slice(0,120).replace(/(?:\.pdf)?$/,'.pdf');
    return new Response(bytes, {headers:{
      'Content-Type':'application/pdf',
      'Content-Disposition':`attachment; filename="${filename}"`,
      'Content-Length':String(bytes.byteLength),
      'Cache-Control':'no-store, private',
      'X-Content-Type-Options':'nosniff'
    }});
  } catch { return new Response('No se pudo preparar la descarga. Vuelve a intentarlo.', {status:400}); }
}
export function GET(){return new Response('Este recurso se utiliza desde el botón de descarga del informe.',{status:405,headers:{Allow:'POST'}})}
