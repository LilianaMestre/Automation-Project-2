describe("Time Tracking for Issues", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then(() => {
        cy.visit("/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const loadIssueTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const loadIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const baseEstimation = "10";
  const revisedEstimation = "20";
  const hoursLogged = "3";
  const hoursRemaining = "4";

  it("Allows editing and clearing of time estimation for an issue", () => {
    loadIssueDetailsModal().within(() => {
      cy.get('input[placeholder="Number"]').clear().type(baseEstimation);
      cy.contains(baseEstimation).should("be.visible");
      cy.contains(`${baseEstimation}h estimated`).should("be.visible");

      cy.get('input[placeholder="Number"]').clear().type(revisedEstimation);
      cy.contains(revisedEstimation).should("be.visible");
      cy.contains(baseEstimation).should("not.exist");
      cy.contains(`${revisedEstimation}h estimated`).should("be.visible");

      cy.get('input[placeholder="Number"]').clear();
      cy.contains(revisedEstimation).should("not.exist");
      cy.contains(`${revisedEstimation}h estimated`).should("not.exist");
    });
  });

  it("Enables logging of time spent and remaining on an issue, and allows removal", () => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    loadIssueTrackingModal().should("be.visible");
    loadIssueTrackingModal().within(() => {
      cy.get('input[placeholder="Number"]').first().clear().type(hoursLogged);
      cy.get('input[placeholder="Number"]').last().clear().type(hoursRemaining);
    });

    loadIssueTrackingModal()
      .find("button")
      .contains("Done")
      .click()
      .should("not.exist");
    loadIssueDetailsModal().should("be.visible");
    cy.contains("No time logged").should("not.exist");
    cy.contains(`${hoursLogged}h logged`).should("be.visible");
    cy.contains(`${hoursRemaining}h remaining`).should("be.visible");

    cy.get('[data-testid="icon:stopwatch"]').click();
    loadIssueTrackingModal()
      .should("be.visible")
      .within(() => {
        cy.get('input[placeholder="Number"]').first().clear();
        cy.get('input[placeholder="Number"]').last().clear();
      });

    loadIssueTrackingModal()
      .find("button")
      .contains("Done")
      .click()
      .should("not.exist");
    loadIssueDetailsModal().should("be.visible");
    cy.contains("No time logged").should("be.visible");
  });
});
