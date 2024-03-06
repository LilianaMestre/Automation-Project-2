describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  // BONUS Task 1
  it("Should check priority dropdown lenght", () => {
    const getPriorityDropdown = () => cy.get('[data-testid="select:priority"]');
    const getSelectDropdownOption = () =>
      cy.get('[data-testid*="select-option"]');

    const expectedLenght = 5;
    let priorityOptions = [];

    getIssueDetailsModal().within(() => {
      getPriorityDropdown()
        .find("i")
        .next()
        .invoke("text")
        .then((initiallySelectedPriority) => {
          priorityOptions.push(initiallySelectedPriority.trim());
          cy.log(
            `Added value: ${initiallySelectedPriority.trim()}, Array length: ${
              priorityOptions.length
            }`
          );
        });
      getPriorityDropdown().click();
      getSelectDropdownOption()
        .each(($option) => {
          priorityOptions.push($option.text().trim());
          cy.log(
            `Added value: ${$option.text().trim()}, Array length: ${
              priorityOptions.length
            }`
          );
        })
        .then(() => {
          // Assert the array length
          expect(priorityOptions.length).to.equal(expectedLenght);
        });
    });
  });

  // BONUS Task 2
  it("Should check that reporter name has only characters in it ", () => {
    const getAvatarText = () => cy.get('[data-testid="avatar:Baby Yoda"]');
    const pattern = /^[A-Za-z\s]*$/;

    getIssueDetailsModal().within(() => {
      getAvatarText().next().invoke("text").should("match", pattern);
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
