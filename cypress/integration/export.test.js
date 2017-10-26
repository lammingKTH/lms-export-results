function login () {
  cy.visit('https://kth.test.instructure.com/login/canvas')

  cy.get('#pseudonym_session_unique_id')
  .type(Cypress.env('CANVAS_TESTUSER_USERNAME'))

  cy.get('#pseudonym_session_password')
  .type(Cypress.env('CANVAS_TESTUSER_PASSWORD'))

  cy.get('#login_form .Button--login').click()
}

describe('Export', () => {
  it('should download a csv file', () => {
    login()

    cy.visit('https://kth.test.instructure.com/courses/4858/external_tools/446?display=borderless')
    cy.contains('Godkänn').click()
    // cy.get('a').filter(el => el.val === 'kth Exportera resultat LOCALHOST').click()
  })
})
