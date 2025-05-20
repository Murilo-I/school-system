describe('Authentication Flow', () => {
  it('should render signup page', () => {
    cy.visit('http://localhost:3015/auth/signup');
    cy.contains('Sign up');
  });

  it('should sign up a new user', () => {
    const randomUser = `user${Date.now()}`;
    cy.visit('http://localhost:3015/auth/signup');

    cy.get('input[name="username"]').type(randomUser);
    cy.get('input[name="email"]').type(`${randomUser}@example.com`);
    cy.get('input[name="senha"]').type('123456');
    cy.get('form').submit();

    cy.url().should('include', '/auth/login');
    cy.contains('Login');
  });

  it('should render login page', () => {
    cy.visit('http://localhost:3015/auth/login');
    cy.contains('Login');
  });

  it('should log in with valid credentials', () => {
    cy.visit('http://localhost:3015/auth/login');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="senha"]').type('123456');
    cy.get('form').submit();

    cy.url().should('not.include', '/auth/login');
  });

  it('should fail login with invalid credentials', () => {
    cy.visit('http://localhost:3015/auth/login');

    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="senha"]').type('wrongpass');
    cy.get('form').submit();

    cy.contains('Invalid credentials');
  });
});
