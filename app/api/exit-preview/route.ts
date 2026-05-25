/**
 * app/api/exit-preview/route.ts — Draft Mode Disable Endpoint
 * SRS §6.3, RULE 4, Phase 2F step 29.
 *
 * Called when the admin clicks "Exit Preview" in the DraftModeBanner.
 * Calls draftMode().disable() and redirects to /.
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(): Promise<never> {
  // Disable Draft Mode — clears the HttpOnly cookie (RULE 4)
  draftMode().disable()

  // Redirect to the home page
  redirect('/')
}
