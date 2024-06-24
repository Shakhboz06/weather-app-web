import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

document.querySelector('.close-form').onclick = () => window.location.href = '../index.html'

const response = await fetch('/api/server')
const key = await response.json()

const supabase = createClient(key.db_url, key.db_key)


document.forms.ContactForm.onsubmit = async(event) => {
    event.preventDefault()
    const fm = new FormData(event.target)
    let obj = {}
    fm.forEach((value, key) => {
        obj[key] = value
    })

    const { error } = await supabase.from('Contacts').insert([obj])
    
    document.querySelector('.form-message').classList.add('message-active')
    document.querySelector('.container form').classList.add('active')
    event.target.reset()
}
document.querySelector('.container p button').onclick = () => {
    document.querySelector('.form-message').classList.remove('message-active')
    document.querySelector('.container form').classList.remove('active')

}
