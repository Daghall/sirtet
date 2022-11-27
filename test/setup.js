import "mocha-cakes-2";
import chai from "chai";

global.expect = chai.expect;

global.document = { addEventListener() { } };
global.window = { location: { search: "" } };
