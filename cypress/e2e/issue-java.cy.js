describe("Priority Dropdown Test", () => {
  const expectedLength = 5; // Predefined expected number of elements in the priority dropdown
  let priorities = []; // Use 'let' because this array will be modified

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });
  it("should validate the number and values of priorities in the dropdown", () => {
    // Click on the priority dropdown to list all options
    cy.get('[data-testid="priority-dropdown"]').click(); // Adjust the selector to your dropdown

    // Push the initially selected priority value into the array
    cy.get('[data-testid="priority-selected"]').then(($selected) => {
      priorities.push($selected.text().trim());
    });

    // Access and loop through all priority options
    cy.get('[data-testid="priority-option"]')
      .each(($el, index, $list) => {
        const priorityText = $el.text().trim();
        priorities.push(priorityText);
        cy.log(
          `Added value: ${priorityText}, Current array length: ${priorities.length}`
        );
      })
      .then(() => {
        // Assert that the array has the expected length
        expect(priorities).to.have.length(expectedLength);
        // Optional: Assert the expected values if needed
        expect(priorities).to.deep.eq([
          "Lowest",
          "Low",
          "Medium",
          "High",
          "Highest",
        ]); // Adjust based on actual expected values
      });
  });
});
