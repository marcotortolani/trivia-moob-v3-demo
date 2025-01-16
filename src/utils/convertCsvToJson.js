export async function parseCSVToQuestions() {
  // const url_doc =
  //   'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2QGjycffs5eAqjqg_hBP0JfJA-1ttHnq_tSOGmHYOqHPIMRhSJGUh-y_icY_iog/pub?gid=1385475711&single=true&output=csv'
  const url_doc =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhO19qtRlgHXK67R33zdFqG74lG7K7zHoAS8q0dNGQ3aEbn_KqA964dLs-ewW4sPqdppb2IzgcsJj4/pub?gid=0&single=true&output=csv'
  const res = await fetch(url_doc)
  const csvData = await res.text()
  
  const categories = []

  // Dividir el texto por líneas
  const lines = csvData.trim().split('\n')
  

  // Iterar sobre las líneas desde la tercera (saltando las dos primeras vacías)
  for (let i = 3; i < lines.length; i++) {
    // Separar cada línea en columnas usando el carácter ','
    const columns = lines[i].split(',')

    // Extraer el nombre de la categoría, pregunta y respuestas
    const categoryName = columns[0].trim()
    const questionText = columns[1].trim()
    const answers = columns.slice(5).map((answer) => answer.trim())   

    // Buscar la respuesta correcta (marcada con "= Correcta")
    const correctAnswerIndex = answers.findIndex((answer) =>
      answer.includes('= Correcta')
    )
    
    // Extraer el texto de la respuesta correcta
    const correctAnswer = answers[correctAnswerIndex]
      .replace(' = Correcta', '')
      .trim()

    // Remover el marcador "= Correcta" de la respuesta correcta en el array
    answers[correctAnswerIndex] = correctAnswer

    // Verificar si la categoría ya existe
    let category = categories.find((cat) => cat.name === categoryName)

    // Si no existe, crear una nueva categoría
    if (!category) {
      category = {
        id: categories.length + 1,
        name: categoryName,
        imgURL: '/img/default.webp',
        bonus: false,
        questions: [],
      }
      categories.push(category)
    }

    // Crear la pregunta con sus respuestas
    const question = {
      id: category.questions.length + 1,
      title: questionText,
      bonus: false,
      answers: answers.map((text, index) => ({
        text,
        isCorrect: index === correctAnswerIndex,
      })),
    }

    // Agregar la pregunta a la categoría correspondiente
    category.questions.push(question)
  }

  return categories
}
