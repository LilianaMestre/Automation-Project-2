describe("Time estimation and logging functionality", () => {
  const issueDetailsSelector = '[data-testid="modal:issue-details"]';
  const trackingModalSelector = '[data-testid="modal:tracking"]';
  const originalEstimateInputSelector = ".sc-dxgOiQ.HrhWu";
  const timeTrackingSectionSelector = ".sc-rBLzX.irwmBe";
  const closeButtonSelector = '[data-testid="icon:close"]';
  const doneButtonSelector = 'button:contains("Done")';
  const numberInputSelector = 'input[placeholder="Number"]';
  const initialEstimatedHours = "70";
  const updatedEstimatedHours = "68";
  const initialTimeSpent = "96";
  const updatedTimeSpent = "69";
  const initialTimeRemaining = "169";
  const updatedTimeRemaining = "170";

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("include", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(`${url}/board`);
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it.only("Should add, edit, and remove time estimation", () => {
    // Adding Estimation
    cy.get(issueDetailsSelector).within(() => {
      cy.get(originalEstimateInputSelector)
        .click()
        .clear()
        .type(initialEstimatedHours)
        .type("{enter}");
    });

    // Asserting the adding time estimation
    cy.get(originalEstimateInputSelector).should(
      "have.value",
      initialEstimatedHours
    );
    cy.get(timeTrackingSectionSelector).should(
      "contain",
      initialEstimatedHours
    );

    // Close the modal/dialog if it's visible and check if it disappears properly
    cy.get(closeButtonSelector).then(($button) => {
      if ($button.is(":visible")) {
        cy.wrap($button).click().should("not.exist");
      }
    });

    // Editing Estimation
    cy.get('[data-testid="modal:issue-details"]', { timeout: 30000 }).within(
      () => {
        cy.get(originalEstimateInputSelector)
          .click()
          .clear()
          .type(updatedEstimatedHours)
          .type("{enter}");
        cy.get(originalEstimateInputSelector).should(
          "have.value",
          updatedEstimatedHours
        );
        cy.get(timeTrackingSectionSelector).should(
          "contain",
          updatedEstimatedHours + "h" // Assuming the hours are represented with an 'h' at the end
        );
        cy.get(closeButtonSelector).first().click();
      }
    );

    // Deleting Estimation
    cy.get(issueDetailsSelector).within(() => {
      cy.get(originalEstimateInputSelector).click().clear().type("{enter}");
      cy.get(originalEstimateInputSelector).should("be.empty");
      cy.get(timeTrackingSectionSelector).should("contain", "No Time Logged");
      cy.get(closeButtonSelector).click();
    });
  });

  it("Should add, edit, and remove time spent and remaining", () => {
    // Adding Time Spent and Remaining
    cy.get(issueDetailsSelector).click();
    cy.get(trackingModalSelector).within(() => {
      cy.get(numberInputSelector).first().clear().type(initialTimeSpent);
      cy.get(numberInputSelector).eq(1).clear().type(initialTimeRemaining);
      cy.get(doneButtonSelector).click();
    });

    // Asserting after adding
    cy.get(timeTrackingSectionSelector)
      .should("contain", initialTimeSpent)
      .and("contain", "logged");
    cy.get(timeTrackingSectionSelector)
      .should("contain", initialTimeRemaining)
      .and("contain", "remaining");

    // Editing Time Spent and Remaining
    cy.get(issueDetailsSelector).click();
    cy.get(trackingModalSelector).within(() => {
      cy.get(numberInputSelector).first().clear().type(updatedTimeSpent);
      cy.get(numberInputSelector).eq(1).clear().type(updatedTimeRemaining);
      cy.get(doneButtonSelector).click();
    });

    // Asserting after editing
    cy.get(timeTrackingSectionSelector)
      .should("contain", updatedTimeSpent)
      .and("contain", "logged");
    cy.get(timeTrackingSectionSelector)
      .should("contain", updatedTimeRemaining)
      .and("contain", "remaining");

    // Deleting Time Spent and Remaining
    cy.get(issueDetailsSelector).click();
    cy.get(trackingModalSelector).within(() => {
      cy.get(numberInputSelector).first().clear();
      cy.get(numberInputSelector).eq(1).clear();
      cy.get(doneButtonSelector).click();
    });

    // Asserting after deleting
    cy.get(timeTrackingSectionSelector).should("contain", "No time logged");
  });
});
