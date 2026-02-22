import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { priceId, gateway } = await req.json()

        if (gateway !== 'paddle') {
            throw new Error('Only Paddle is supported')
        }

        const PADDLE_API_KEY = Deno.env.get('PADDLE_API_KEY')
        if (!PADDLE_API_KEY) {
            throw new Error('PADDLE_API_KEY is not configured in Supabase secrets')
        }

        // Paddle API v3: Create a transaction and get product/price details
        // In a real scenario, we might want to use Paddle.js checkout, 
        // but for server-side initialization, we create a transaction or use the checkout API.

        // This is a simplified example of creating a checkout via Paddle API
        const response = await fetch('https://api.paddle.com/transactions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PADDLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    {
                        price_id: priceId, // e.g., 'pri_01h...'
                        quantity: 1
                    }
                ],
                custom_data: {
                    user_id: user.id
                }
            })
        })

        const paddleData = await response.json()

        if (!response.ok) {
            throw new Error(`Paddle Error: ${JSON.stringify(paddleData.error)}`)
        }

        return new Response(JSON.stringify({
            status: 'success',
            checkout_id: paddleData.data.id,
            // Paddle.js will use this id to open the checkout
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('Checkout Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
