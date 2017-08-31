var assert = require('assert');

const tangramReference = require('tangram-reference').load();
const Carto = require('carto');
const CartoCSSRenderer = new Carto.RendererJS({
    reference: tangramReference,
    strict: true
});
const color = require('../src/color.js');

const tangram_carto = require('../src/index.js');
const scenarios = require('./scenarios.js');
const { evalIfNeeded } = require('./utils.js');

describe('Markers', function () {
    scenarios.forEach(function (scenario) {
        describe(scenario.name, function () {
            const expected = scenario.expected;
            const output = tangram_carto.layerToYAML(CartoCSSRenderer.render(scenario.ccss).getLayers()[0]);
            //console.log(JSON.stringify(output, null, 4));
            describe('.draw', function () {
                it('should have color', function () {
                    assert.strictEqual(evalIfNeeded(output.draw.points.color, scenario.feature), color.normalize(expected.color, tangramReference));
                });
                it('should have collide', function () {
                    assert.strictEqual(evalIfNeeded(output.draw.points.collide, scenario.feature), expected.collide);
                });
                it('should have size', function () {
                    assert.strictEqual(evalIfNeeded(output.draw.points.size, scenario.feature), expected.size);
                });
                it('should have blend mode: src-over, called overlay in Tangram', function () {
                    assert.strictEqual(evalIfNeeded(output.draw.points.blend, scenario.feature), expected.blend);
                });
                describe('.outline', function () {
                    it('should have color', function () {
                        assert.strictEqual(evalIfNeeded(output.draw.points.outline.color, scenario.feature), color.normalize(expected.outlineColor, tangramReference));
                    });
                    it('should have size', function () {
                        assert.strictEqual(evalIfNeeded(output.draw.points.outline.width, scenario.feature), expected.outlineSize);
                    });
                });
            });
        });
    });
    it('should be empty when symbolizer is not active', function(){
        const ccss='#layer{}';
        const output = tangram_carto.layerToYAML(CartoCSSRenderer.render(ccss).getLayers()[0]);
        console.log(output);
        assert.ok(output.draw.points===undefined);
    });
});
