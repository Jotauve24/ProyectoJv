import type { Metadata } from 'next';
export const metadata: Metadata = {title:'ProyectoJv',description:'Material de apoyo para aprender informática empresarial.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
