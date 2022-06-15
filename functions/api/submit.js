addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  const createAirtableRecord = body => {
    return fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-type': `application/json`
      }
    })
  }

  const submitHandler = async request => {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405
      })
    }
  
    const body = await request.formData();
  
    const {
      inputName,
      inputEmail,
      inputMessage
    } = Object.fromEntries(body)
  
    // The keys in "fields" are case-sensitive, and
    // should exactly match the field names you set up
    // in your Airtable table, such as "First Name".
    const reqBody = {
      fields: {
        "Name": inputName,
        "Email": inputEmail,
        "Message": inputMessage
      }
    }
  
    await createAirtableRecord(reqBody)
    return Response.redirect(FORM_URL)
  }
  