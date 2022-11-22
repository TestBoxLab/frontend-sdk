describe('testbox script', () => {
  it('sends message to TestBox', () => {
    cy.visit('http://localhost:8080', {
      onBeforeLoad: (win) => {
        cy.spy(win.parent, "postMessage").as("postMessage");
      }
    });

    cy.get('@postMessage').should('have.been.calledOnceWith', {
      testbox: {
        version: 1,
        sender: "partner",
        event: "initialize-request",
        data: undefined,
      }
    }, "*");
  })
});
