import React from 'react';
import { Form, Formik } from 'formik';
import { render, screen } from '@testing-library/react';
import { useConceptAnswers } from '../field.resource';
import { CodedPersonAttributeField } from './coded-person-attribute-field.component';

const mockUseConceptAnswers = jest.mocked(useConceptAnswers);

jest.mock('../field.resource', () => ({
  ...jest.requireActual('../field.resource'),
  useConceptAnswers: jest.fn(),
}));

describe('CodedPersonAttributeField', () => {
  const conceptAnswers = [
    { uuid: '1', display: 'Option 1' },
    { uuid: '2', display: 'Option 2' },
  ];

  const personAttributeType = {
    format: 'org.openmrs.Concept',
    display: 'Referred by',
    uuid: '4dd56a75-14ab-4148-8700-1f4f704dc5b0',
    name: '',
    description: '',
  };

  const answerConceptSetUuid = '6682d17f-0777-45e4-a39b-93f77eb3531c';
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseConceptAnswers.mockReturnValue({
      data: conceptAnswers,
      isLoading: false,
      error: null,
    });

    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders an error if there is no concept answer set provided', () => {
    expect(() => {
      render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form>
            <CodedPersonAttributeField
              answerConceptSetUuid={null}
              customConceptAnswers={[]}
              id="attributeId"
              label={personAttributeType.display}
              personAttributeType={personAttributeType}
              required={false}
            />
          </Form>
        </Formik>,
      );
    }).toThrow(expect.stringMatching(/has been defined without an answer concept set UUID/i));
  });

  it('renders an error if the concept answer set does not have any concept answers', () => {
    mockUseConceptAnswers.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    expect(() => {
      render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <Form>
            <CodedPersonAttributeField
              id="attributeId"
              personAttributeType={personAttributeType}
              answerConceptSetUuid={answerConceptSetUuid}
              label={personAttributeType.display}
              customConceptAnswers={[]}
              required={false}
            />
          </Form>
        </Formik>,
      );
    }).toThrow(expect.stringMatching(/does not have any concept answers/i));
  });

  it('renders the conceptAnswers as select options', () => {
    render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <Form>
          <CodedPersonAttributeField
            id="attributeId"
            personAttributeType={personAttributeType}
            answerConceptSetUuid={answerConceptSetUuid}
            label={personAttributeType.display}
            customConceptAnswers={[]}
            required={false}
          />
        </Form>
      </Formik>,
    );

    expect(screen.getByLabelText(/Referred by/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Option 2/i)).toBeInTheDocument();
  });

  it('renders customConceptAnswers as select options when they are provided', () => {
    render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <Form>
          <CodedPersonAttributeField
            id="attributeId"
            personAttributeType={personAttributeType}
            answerConceptSetUuid={answerConceptSetUuid}
            label={personAttributeType.display}
            customConceptAnswers={[
              {
                uuid: 'A',
                label: 'Special Option A',
              },
              {
                uuid: 'B',
                label: 'Special Option B',
              },
            ]}
            required={false}
          />
        </Form>
      </Formik>,
    );

    expect(screen.getByLabelText(/Referred by/i)).toBeInTheDocument();
    expect(screen.getByText(/Special Option A/i)).toBeInTheDocument();
    expect(screen.getByText(/Special Option B/i)).toBeInTheDocument();
    expect(screen.queryByText(/Option 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Option 2/i)).not.toBeInTheDocument();
  });
});
