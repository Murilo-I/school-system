describe('Turma CRUD Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3015/home');
  });

  it('should open the Turma form', () => {
    cy.contains('Cadastrar Turma').click();
    cy.url().should('include', '/turma/form');
    cy.get('form').should('exist');
  });

  it('should open the Aluno form', () => {
    cy.contains('Cadastrar Aluno').click();
    cy.url().should('include', '/aluno/form');
    cy.get('form').should('exist');
  });
});
