export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  console.log({id});
  const data = await fetch(`https://api.example.com/data/${id}`);
  const jsonData = await data.json();
  return new Response(JSON.stringify(jsonData));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { encryptedData } = body;
    
    if (!encryptedData) {
      return new Response(
        JSON.stringify({ error: "No se recibieron datos encriptados" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Datos encriptados recibidos:", { encryptedData });
    const backendUrl = process.env.BACKEND_API_URL || 'https://api.backend.example.com/payments';
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BACKEND_API_KEY || ''}`,
      },
      body: JSON.stringify({ encryptedData }),
    });
    
    const responseData = await backendResponse.json();
    return new Response(
      JSON.stringify({ 
        success: backendResponse.ok, 
        data: responseData,
        message: backendResponse.ok ? "Pago procesado correctamente" : "Error al procesar el pago" 
      }),
      { 
        status: backendResponse.ok ? 200 : 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Error al procesar los datos en el API:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Error al procesar la solicitud" 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}