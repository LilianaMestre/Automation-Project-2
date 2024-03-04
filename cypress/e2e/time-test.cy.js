describe("Time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    // Ensure you replace 'project' with the actual project name or ID
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it.only("Should add, edit and remove time estimation", () => {
    const originalEstimation = "10";
    const updatedEstimation = "20";

    // Adding estimation
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(".sc-dxgOiQ.HrhWu")
        .click()
        .clear()
        .type(originalEstimation)
        .type("{enter}");
    });
    cy.get(".sc-rBLzX.irwmBe").should("contain", originalEstimation);
    cy.get(".my-button").click({ multiple: true });

    // Reopening issue to verify the added estimation persists
    cy.contains("This is an issue of type: Task.").click();
    cy.get(".sc-rBLzX.irwmBe").should("contain", originalEstimation);

    // Editing estimation
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(".sc-dxgOiQ.HrhWu")
        .click()
        .clear()
        .type(updatedEstimation)
        .type("{enter}");
    });
    cy.get(".sc-rBLzX.irwmBe").should("contain", updatedEstimation);
    cy.get('[data-testid="icon:close"]').click();

    // Reopening issue to verify the updated estimation persists
    cy.contains("This is an issue of type: Task.").click();
    cy.get(".sc-rBLzX.irwmBe").should("contain", updatedEstimation);

    // Removing estimation
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(".sc-dxgOiQ.HrhWu").click().clear().type("{enter}");
    });
    cy.get(".sc-rBLzX.irwmBe").should("contain", "Number"); // Assuming 'Number' is the placeholder or indication of no estimation
    cy.get('[data-testid="icon:close"]').click();

    // Reopening issue to verify the removal of estimation
    cy.contains("This is an issue of type: Task.").click();
    cy.get(".sc-rBLzX.irwmBe").should("contain", "Number");
  });

  it("Should log and remove time", () => {
    const timeSpent = "2";
    const timeRemaining = "5";

    // Logging time
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(".sc-bMvGRv.IstSR").click();
    });
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]')
        .first()
        .click()
        .clear()
        .type(timeSpent);
      cy.get('input[placeholder="Number"]').eq(1).clear().type(timeRemaining);
      cy.contains("button", "Done").click();
    });
    cy.get(".sc-rBLzX.irwmBe")
      .should("contain", timeSpent)
      .and("contain", "logged");
    cy.get(".sc-rBLzX.irwmBe")
      .should("contain", timeRemaining)
      .and("contain", "remaining");

    // Removing logged time
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(".sc-bMvGRv.IstSR").click();
    });
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]').first().click().clear();
      cy.get('input[placeholder="Number"]').eq(1).click().clear();
      cy.contains("button", "Done").click();
    });
    cy.get(".sc-rBLzX.irwmBe").should("contain", "No time logged");
  });
});
