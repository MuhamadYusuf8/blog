import { redirect } from 'next/navigation'

// /jurnal → /category/jurnal
export default function JurnalPage() {
  redirect('/category/Desain')
}
