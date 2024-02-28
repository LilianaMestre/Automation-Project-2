describe("Issue Deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should cancel deletition of an issue", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.contains("button", "Cancel").click()
    cy.get('[data-testid="icon:close"]').first().click();
    cy.contains("This is an issue of type: Task.").should("exist");
  });

  it("Should delete an issue", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.contains("button", "Delete issue").click();
    cy.contains("This is an issue of type: Task.").should("not.exist");
  });
});
