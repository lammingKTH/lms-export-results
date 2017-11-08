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
    // log.info(`The user ${b.lis_person_sourcedid}, ${b.custom_canvas_user_login_id}, is exporting the course ${b.context_label} with id ${b.custom_canvas_course_id}`)
    // cy.visit('https://kth.test.instructure.com/courses/4/external_tools/432?display=borderless')
    const body = {
      custom_canvas_course_id: 139,
// custom_canvas_user_id:15
      custom_canvas_user_login_id: 'emilsten@kth.se',
// lis_person_contact_email_primary:emilsten@kth.se
      lis_person_sourcedid: 'u1znmoik'
    }

    cy.request('POST', 'https://api-r.referens.sys.kth.se/api/lms-export-results/export', body)
    .then(response => {
      // response.body is automatically serialized into JSON
      expect(response.body).to.have.property('name', 'Jane') // true
    })

    // cy.visit('https://api-r.referens.sys.kth.se/api/lms-export-results/_about')

    cy.contains('Godkänn').click()

    // cy.request('https://kth.test.instructure.com/courses/4858/external_tools/446?display=borderless').then(response =>{
    //   console.log('git response')
    //   expect(response.status).to.eq(200)
    // })
  })
})
