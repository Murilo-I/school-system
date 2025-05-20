const baseUrl = "http://localhost:3015";

async function deleteTurma(id) {
    return await fetch(baseUrl + "/turma/delete/" + id, {
        method: "DELETE"
    }).then(resp => resp.json())
        .finally(() => window.location.reload());
}

async function deleteAluno(id) {
    return await fetch(baseUrl + "/aluno/delete/" + id, {
        method: "DELETE"
    }).then(resp => resp.json())
        .finally(() => window.location.reload());
}