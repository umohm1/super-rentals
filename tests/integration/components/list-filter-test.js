import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerKeyEvent, fillIn } from '@ember/tests-helpers';
import hbs from 'htmlbars-inline-precompile';

const ITEMS = [{city: 'San Francisco'}, {city: 'Portland'}, {city: 'Seattle'}];
const FILTERED_ITEMS = [{city: 'San Francisco'}];

module('Integration | Component | list-filter', function(hooks) {
  setupRenderingTest(hooks);

  test('should initially load all listings', async function(assert) {
    this.set('filterByCity', () => Promise.resolve({results: ITEMS }));
 
    test('should update with matching listings', async function (assert) {
      this.set('filterByCity', (val) => {
        if (val === '') {
          return Promise.resolve({
            query: val,
            results: ITEMS
          });
        } else {
          return Promise.resolve({
            query: val,
            results: FILTERED_ITEMS
          });
        }
      });

    await render(hbs`
    <ListFilter @filter={{action filterByCity}} as |results|>
      <ul>
      {{#each results as |item|}}
        <li class="city">
          {{item.city}}
        </li>
        {{/each}}
      </ul>
    </ListFilter>|
    `);

    await fillIn(this.element.querySelector('.list-filter input'), 's');
    await triggerKeyEvent(this.element.querySelector('.list-filter input'), "keyup", 83);

    assert.equal(this.element.querySelectorAll('.city').length, 1, 'One result returned');
    assert.equal(this.element.querySelector('.city').textContent.trim(), 'San Francisco');
  });
