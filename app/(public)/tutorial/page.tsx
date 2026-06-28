import { redirect } from 'next/navigation'

// /tutorial → /category/tutorial
export default function TutorialPage() {
  redirect('/category/Tutorial')
}
