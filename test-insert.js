import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
    console.log('Logging in as kadag65682@iaciu.com...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'kadag65682@iaciu.com',
        password: '123456'
    });

    if (authError) {
        console.error('Login Failed:', authError.message);
        return;
    }

    const user = authData.user;
    console.log('Logged in! User ID:', user.id);

    console.log('Attempting to insert a meal exactly like ScanResult.tsx...');

    const foods = [
        {
            id: "ai-1234",
            name_tr: "Test Yemeği",
            name_en: "Test Food",
            estimated_grams: 200,
            confidence: 0.9,
            calories_per_100g: 100,
            protein_per_100g: 10,
            carbs_per_100g: 5,
            fat_per_100g: 2,
            calories_total: 200,
            protein_total: 20,
            carbs_total: 10,
            fat_total: 4,
        }
    ];

    const mealDataRows = foods.map(food => ({
        user_id: user.id,
        meal_type: 'lunch',
        food_name: food.name_tr,
        food_name_en: food.name_en,
        portion_grams: food.estimated_grams,
        calories: food.calories_total,
        protein: food.protein_total,
        carbs: food.carbs_total,
        fat: food.fat_total,
        fiber: food.fiber_per_100g ? Number(((food.fiber_per_100g * food.estimated_grams) / 100).toFixed(1)) : 0,
        ai_confidence: food.confidence,
        logged_date: new Date().toISOString().split('T')[0]
    }));

    const { data: insertData, error: insertError } = await supabase.from('meals').insert(mealDataRows).select();

    if (insertError) {
        console.error('❌ INSERT FAILED!');
        console.error(insertError);
    } else {
        console.log('✅ INSERT SUCCEEDED!');
        console.log(insertData);
    }

    // Then try to fetch it back like useMeals
    console.log('Attempting to fetch meals back for today...');
    const targetDateStr = new Date().toISOString().split('T')[0];

    const { data: fetchMeals, error: fetchError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .eq('logged_date', targetDateStr)
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error('❌ FETCH FAILED!', fetchError);
    } else {
        console.log(`✅ FETCH SUCCEEDED! Found ${fetchMeals.length} meals for today.`);
        console.log(fetchMeals);
    }
}

run();
