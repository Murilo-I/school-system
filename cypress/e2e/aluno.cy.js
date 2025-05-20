describe('Aluno CRUD Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3015/aluno');
  });

  it('should list alunos on the /aluno page', () => {
    cy.contains('Lista Alunos');
    cy.get('table').should('exist');
  });

  it('should create a new Aluno', () => {
    cy.visit('http://localhost:3015/aluno/form');

    cy.get('input[name="matricula"]').type('202501');
    cy.get('input[name="nome"]').type('Maria Teste');

    cy.get('select[name="fk_turma"]').select(1);

    cy.get('form').submit();

    cy.url().should('include', '/aluno');
    cy.contains('Maria Teste');
  });

  it('should edit an existing Aluno', () => {
    cy.contains('Maria Teste').parent().find('a[href*="/aluno/form"]').click();

    cy.get('input[name="nome"]').clear().type('Maria Atualizada');
    cy.get('form').submit();

    cy.url().should('include', '/aluno');
    cy.contains('Maria Atualizada');
  });

  it('should delete an Aluno', () => {
    cy.contains('Maria Atualizada').parent().find('form button[type="submit"]').click();

    cy.url().should('include', '/aluno');
    cy.contains('Maria Atualizada').should('not.exist');
  });
});
