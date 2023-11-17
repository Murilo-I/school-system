export function checkTurmaAluno(fkTurma, idTurma) {
    console.log(`check turma aluno ${fkTurma} - ${idTurma} : ${fkTurma === idTurma}`);
    return fkTurma === idTurma;
}