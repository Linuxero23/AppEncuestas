import { supabase } from "../supabaseClient";

export async function getSurveys() {
  const { data, error } = await supabase.from("surveys").select("*");
  if (error) throw error;
  return data;
}


export async function getSurveyById(id) {
  const { data, error } = await supabase.from("surveys").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}


export async function createSurvey(survey) {
  const { data, error } = await supabase.from("surveys").insert([survey]).select();
  if (error) throw error;
  return data[0];
}

// Actualizar encuesta
export async function updateSurvey(id, fields) {
  const { data, error } = await supabase.from("surveys").update(fields).eq("id", id).select();
  if (error) throw error;
  return data[0];
}

// Eliminar encuesta
export async function deleteSurvey(id) {
  const { error } = await supabase.from("surveys").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Guardar respuesta de usuario
export async function submitSurveyResponse(surveyId, userId, answers) {
  try {
    // 💡 Calcula el puntaje (por ahora: 1 punto por pregunta respondida)
    const totalScore = Object.keys(answers).length;

    const { data, error } = await supabase
      .from("survey_responses")
      .insert([
        {
          survey_id: surveyId,
          user_id: userId,
          answers: answers,
          score: totalScore, // 👈 guarda el puntaje
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error("🔥 Error guardando respuesta:", err);
    throw err;
  }
}

export async function getResponsesBySurvey(surveyId) {
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("survey_id", surveyId);

  if (error) throw error;
  return data;
}

// Obtener todas las respuestas de un usuario
export async function getResponsesByUser(userId) {
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

