describe("Issue Time Tracking", () => {
  beforeEach(() => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("include", `${Cypress.env("baseUrl")}project`)
        .then((url) => {
          cy.visit(`${url}/board`);
          cy.contains("This is an issue of type: Task.").click();
        });
    });

    it("Add estimation - User can add estimation to issue", () => {
      // Precondition: User opened issue detail view (handled in beforeEach)

      // Check that time tracker has no spent time added (“No Time Logged” label is visible)
      cy.contains("No Time Logged").should("be.visible");

      // User adds value 10 to “Original estimate (hours)” field
      cy.get(inputFieldTime).type("10"); // Assuming 'inputFieldTime' selector for "Original estimate (hours)" field
      cy.get(timeTrackingButton).click(); // Close issue detail page

      // User reopens the same issue to check that original estimation is saved
      cy.reload();
      // Expected result: Entered value in hours is visible in the time tracking section
      cy.contains("10h").should("be.visible"); // Check if '10h' is displayed in the time tracking section
    });

    it("Update estimation - User updates estimation previously added to issue", () => {
      // Precondition: Issue detail view opened and estimation already added

      // User changes value from previous value to 20
      cy.get(inputFieldTime).clear().type("20");
      cy.get(timeTrackingButton).click(); // Close issue detail page

      // User reopens the same issue to check that original estimation is saved
      cy.reload();
      // Expected result: Updated value in hours is visible
      cy.contains("20h").should("be.visible");
    });

    it("Remove estimation - User removes estimation previously added to issue", () => {
      // Precondition: Issue detail view opened and estimation already added

      // User removes value from the field “Original estimate (hours)”
      cy.get(inputFieldTime).clear();
      cy.get(timeTrackingButton).click(); // Close issue detail page

      // User reopens the same issue to check that original estimation is removed
      cy.reload();
      // Expected result: Value is removed from the time tracking section
      cy.contains("h").should("not.exist");
      // Placeholder “Number” is visible in the original estimate field
      cy.get(inputFieldTime).should("have.value", "");
    });

    it("Log time - User logs spent time to recently created issue", () => {
      // Precondition: Issue detail view opened

      // User clicks on time tracking section and checks if the pop-up is opened
      cy.get(timeTrackingButton).click();
      cy.get(timeTrackingModal).should("be.visible");

      // User enters value 2 to the field “Time spent” and value 5 to the field “Time remaining”
      cy.get('input[name="timeSpent"]').type("2");
      cy.get('input[name="timeRemaining"]').type("5");
      cy.get('button[type="submit"]').click(); // Assuming there is a submit button in the modal

      // Expected result: Spent time number is visible in the time tracking section
      cy.contains("2h").should("be.visible"); // Check if '2h' (time spent) is displayed
      // “No Time Logged” label is no longer visible and user sees added time remaining value
      cy.contains("No Time Logged").should("not.exist");
      cy.contains("5h").should("be.visible"); // Check if '5h' (time remaining) is displayed instead of original estimation
    });

    it("Remove logged time - User removes logged spent time from recently created issue", () => {
      // Precondition: Issue detail view opened and time logged

      // User clicks on time tracking section and checks if the pop-up is opened
      cy.get(timeTrackingButton).click();
      cy.get(timeTrackingModal).should("be.visible");

      // User removes value from the fields “Time spent” and “Time remaining”
      cy.get('input[name="timeSpent"]').clear();
      cy.get('input[name="timeRemaining"]').clear();
      cy.get('button[type="submit"]').click(); // Assuming there is a submit button in the modal

      // Expected result: Spent time number is removed from the time tracking section
      cy.contains("h").should("not.exist"); // Confirm no hour labels are visible
      // User sees original estimation in the time tracking section and added time remaining value is removed
      cy.contains("No Time Logged").should("be.visible");
    });
  });
});
