import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Palette from "./Palette";
import PaletteList from "./PaletteList";
import SingleColorPalette from "./SingleColorPalette";
import Page from "./Page";
import NewPaletteForm from "./NewPaletteForm";
import seedColors from "./seedColors";
import { generatePalette } from "./colorHelpers";

class App extends Component {
  savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
  state = { palettes: this.savedPalettes || seedColors };

  findPalette = (id) => {
    return this.state.palettes.find(function (palette) {
      return palette.id === id;
    });
  };

  deletePalette = (id) => {
    this.setState(
      (st) => ({
        palettes: st.palettes.filter((palette) => palette.id !== id),
      }),
      this.syncLocalStorage
    );
  };

  savePalette = (newPalette) => {
    this.setState(
      { palettes: [...this.state.palettes, newPalette] },
      this.syncLocalStorage
    );
  };

  syncLocalStorage = () => {
    //save palettes to local storage
    window.localStorage.setItem(
      "palettes",
      JSON.stringify(this.state.palettes)
    );
  };

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/palette/new"
          render={(routeProps) => (
            <Page>
              <NewPaletteForm
                savePalette={this.savePalette}
                palettes={this.state.palettes}
                {...routeProps}
              />
            </Page>
          )}
        />
        <Route
          exact
          path="/palette/:paletteId/:colorId"
          render={(routeProps) => (
            <Page>
              <SingleColorPalette
                colorId={routeProps.match.params.colorId}
                palette={generatePalette(
                  this.findPalette(routeProps.match.params.paletteId)
                )}
              />
            </Page>
          )}
        />
        <Route
          exact
          path="/"
          render={(routeProps) => (
            <Page>
              <PaletteList
                palettes={this.state.palettes}
                deletePalette={this.deletePalette}
                {...routeProps}
              />
            </Page>
          )}
        />
        <Route
          exact
          path="/palette/:id"
          render={(routeProps) => (
            <Page>
              <Palette
                palette={generatePalette(
                  this.findPalette(routeProps.match.params.id)
                )}
              />
            </Page>
          )}
        />
        <Route
          render={(routeProps) => (
            <Page>
              <PaletteList
                palettes={this.state.palettes}
                deletePalette={this.deletePalette}
                {...routeProps}
              />
            </Page>
          )}
        />
      </Switch>
    );
  }
}

export default App;