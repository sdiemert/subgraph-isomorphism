"use strict";
/**
 * Create by sdiemert on 2017-09-02
 *
 * Unit tests for: FILE TO TEST.
 */

var assert = require('assert');
var iso    = require('../index.js');

const G1 = [
    [0, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 0],
];

const P1 = [
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 0]
];

describe("index", function () {

    describe("#getIsomorphicSubgraphs()", function () {

        it("should detect a single isomorphism", function () {
            const result = iso.getIsomorphicSubgraphs(G1, P1);
            assert.equal(result.length, 1);

            const morph = result[0];
            assert.deepEqual(morph, [[0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        });

        it("should detect two isomorphisms", function () {
            let G2       = G1.slice(0);
            G2[0][3]     = 1;
            const result = iso.getIsomorphicSubgraphs(G2, P1);
            assert.equal(result.length, 2);

            const morph1 = result[1];
            assert.deepEqual(morph1, [[0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);

            const morph2 = result[0];
            assert.deepEqual(morph2, [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]]);
        });

        it("should find one morphism for equivalent graphs", function(){
            const G = [[0,1,0], [0,0,1], [0,0,0]];
            const result = iso.getIsomorphicSubgraphs(G,G);
            assert.equal(result.length, 1);
            assert.deepEqual(result[0], [[1,0,0], [0,1,0], [0,0,1]]);
        });

        it("should not find an isomorphism", function(){
            const G = [[0,0,0], [0,0,0], [0,0,0]];
            const P = [[0,1,0], [0,0,1], [0,0,0]];
            const result = iso.getIsomorphicSubgraphs(G,P);
            assert.equal(result.length, 0);
        });

        it("should find all three morphisms for triangle", function(){
            const G = [[0,1,0], [0,0,1], [1,0,0]];
            const result = iso.getIsomorphicSubgraphs(G,G);
            assert.equal(result.length, 3);

            assert.deepEqual(result[0], [[1,0,0],[0,1,0], [0,0,1]]);
            assert.deepEqual(result[1], [[0,1,0],[0,0,1], [1,0,0]]);
            assert.deepEqual(result[2], [[0,0,1],[1,0,0], [0,1,0]]);
        });

        it("should only return the number we specify", function(){
            const G = [[0,1,0], [0,0,1], [1,0,0]];
            let result = iso.getIsomorphicSubgraphs(G,G,1);
            assert.equal(result.length, 1);
            result = iso.getIsomorphicSubgraphs(G,G,2);
            assert.equal(result.length, 2);
            result = iso.getIsomorphicSubgraphs(G,G,3);
            assert.equal(result.length, 3);
            result = iso.getIsomorphicSubgraphs(G,G,null);
            assert.equal(result.length, 3);
        });

    });

    describe("#checkSquareMatrix", function(){

        it("should return true for square", function(){
            assert.equal(iso.priv.checkSquareMatrix([[0,0],[0,0]]), true);
        });

        it("should return false for not square", function(){
            assert.equal(iso.priv.checkSquareMatrix([[0,0],[0,0,0]]), false);
        });

    })

});