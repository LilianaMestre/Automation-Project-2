class Wine {
  constructor() {
    this.age = "1889";
    this.type = "red-dray";
  }

  drink() {
    cy.get("#wine").click();
  }
}
