/**
 * columns — generic n-up row (Block Collection shape; reconstructive).
 * Authoring rows: one row = one visual row; cells become equal columns.
 * Used on het-vatencollectief for the icon+link checks strip.
 */
export default async function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('columns-col');
      const pic = cell.querySelector('picture, img');
      if (pic && cell.textContent.trim()) cell.classList.add('columns-col-iconed');
    });
  });
}
