require('dotenv').config();

export default (req, res) => {
    res.status(200).json({ 
        key: process.env.API_KEY, 
        db_url: process.env.SUPABASE_URL, 
        db_key: process.env.SUPABASE_KEY
    })
}
