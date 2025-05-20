describe('Turma CRUD Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3015/turma');
  });

  it('should list turmas', () => {
    cy.contains('Lista Turmas');
    cy.get('table').should('exist');
  });

  it('should create a new Turma', () => {
    cy.visit('http://localhost:3015/turma/form');

    cy.get('input[name="desc"]').type('Turma Teste 101');
    cy.get('form').submit();

    cy.url().should('include', '/turma');
    cy.contains('Turma Teste 101');
  });

  it('should edit an existing Turma', () => {
    cy.contains('Turma Teste 101').parent().find('a[href*="/turma/form"]').click();

    cy.get('input[name="desc"]').clear().type('Turma Atualizada 101');
    cy.get('form').submit();

    cy.url().should('include', '/turma');
    cy.contains('Turma Atualizada 101');
  });

  it('should delete a Turma', () => {
    cy.contains('Turma Atualizada 101').parent().find('form button[type="submit"]').click();

    cy.url().should('include', '/turma');
    cy.contains('Turma Atualizada 101').should('not.exist');
  });
});
