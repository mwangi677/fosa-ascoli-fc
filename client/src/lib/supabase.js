import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpjimunbypimltwrecbg.supabase.co'

const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwamltdW5ieXBpbWx0d3JlY2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTQ5NzYsImV4cCI6MjA5NTM3MDk3Nn0.G0iZ8IB5ptzq64lG-n-B8Rh97dg7i1zuJdLi9DW61wU'

export const supabaseClient = createClient(supabaseUrl, supabaseKey)
