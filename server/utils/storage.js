const { supabase } = require('../supabase')

async function uploadToStorage(file, prefix = 'file') {
    if (!file) return null

    const fileName = `${prefix}-${Date.now()}-${file.originalname}`

    const { error: uploadError } = await supabase.storage
        .from('player-images')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        })

    if (uploadError) {
        throw uploadError
    }

    const { data } = supabase.storage.from('player-images').getPublicUrl(fileName)

    return data.publicUrl
}

module.exports = { uploadToStorage }
