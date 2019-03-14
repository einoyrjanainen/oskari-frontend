import React from 'react';
import styled from 'styled-components';
import { Steps, Step } from '../components/Steps';
import { LayerTypeSelection } from './LayerWizard/LayerTypeSelection';
import { LayerURLForm } from './LayerWizard/LayerURLForm';
import { LayerDetails } from './LayerWizard/LayerDetails';
import { Button } from '../components/Button';
import { LayerWizardService } from './LayerWizard/LayerWizardService';

export class LayerWizard extends React.Component {
    constructor (props) {
        super(props);
        this.service = new LayerWizardService(() => this.setState({ layer: this.service.getLayer() }));
    }
    setStep (requested) {
        switch (requested) {
        case 0:
            this.service.getMutator().setType();
            break;
        case 1:
            this.service.getMutator().setVersion();
            break;
        }
    }
    showLayerForm (layer) {
        this.setState((state) => {
            layer.type = state.layerType;

            return {
                ...state,
                layer
            };
        });
    }
    getStep () {
        if (!this.service.hasType()) {
            return 0;
        }
        if (!this.service.hasVersion()) {
            return 1;
        }
        return 2;
    }
    isStep (input) {
        return this.getStep() === input;
    }
    render () {
        const StyledRootEl = styled('div')`
            margin: 10px;
            padding: 10px;
        `;
        const layer = this.service.getLayer();
        let typeTitle = 'Layer type';
        if (layer.type) {
            typeTitle = `${typeTitle}: ${layer.type}`;
        }
        const mutator = this.service.getMutator();
        return (
            <StyledRootEl ref={this.myRef}>
                <Steps current={this.getStep()}>
                    <Step title={typeTitle} />
                    <Step title="URL" />
                    <Step title="Details" />
                </Steps>
                { this.isStep(0) &&
                    <LayerTypeSelection
                        types={this.service.getLayerTypes()}
                        onSelect={(type) => mutator.setType(type)} />
                }
                { this.isStep(1) &&
                    <div>
                        <LayerURLForm
                            layer={layer}
                            onSuccess={(layerInfo) => this.showLayerForm(layerInfo)}
                            service={mutator} />
                        <hr/>
                        <Button onClick={() => this.setStep(0)}>Back</Button>
                    </div>
                }
                { this.isStep(2) &&
                    <div>
                        <LayerDetails
                            layer={layer} />
                        <hr/>
                        <Button onClick={() => this.setStep(1)}>Back</Button>
                    </div>
                }
            </StyledRootEl>
        );
    }
}
