function errorHandler(err, req, res, next) {
  console.error(err);

  // Erros de validação do Zod
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Dados inválidos.",
      details: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Erros conhecidos que o próprio código lança
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Erro genérico — não expõe detalhes internos
  return res.status(500).json({ error: "Erro interno no servidor." });
}

// Função auxiliar para criar erros com statusCode
function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

module.exports = { errorHandler, createError };