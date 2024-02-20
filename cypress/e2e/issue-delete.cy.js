const issueTitle = "This is an issue of type: Task.";
describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  it("Should delete issue successfully", () => {
    const expectedNumberOfIssuesAfterDeletion = 3;

    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Are you sure you want to delete this issue?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good").should("be.visible");
      cy.contains("Delete issue").click();
    });

    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueTitle).should("not.exist");
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        expectedNumberOfIssuesAfterDeletion
      );
    });
  });

  it("Should cancel issue deletion", () => {
    const expectedAmountOfIssuesAfterCancel = 4;

    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Cancel").click();
    });

    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueTitle).should("be.visible");
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        expectedAmountOfIssuesAfterCancel
      );
    });
  });
});
