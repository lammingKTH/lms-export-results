describe('Export', ()=>{
  it('should download a csv file', ()=>{
      cy.visit('https://kth.test.instructure.com/login/canvas')

      cy.get('#pseudonym_session_unique_id')
      .type(Cypress.env('CANVAS_TESTUSER_USERNAME'))

      cy.get('#pseudonym_session_password')
      .type(Cypress.env('CANVAS_TESTUSER_PASSWORD'))

      cy.get('#login_form .Button--login').click()

  })
})
