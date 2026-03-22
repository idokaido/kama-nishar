import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qfsvpzsutxklcjkpesxh.supabase.co'
const supabaseKey = 'sb_publishable_4zpWxLETlYCNxyFuFbcmLA_js1lJR5S'

export const supabase = createClient(supabaseUrl, supabaseKey)
