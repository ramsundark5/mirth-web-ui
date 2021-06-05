import HL7Dictionary from 'hl7-dictionary';
import { v4 as uuidv4 } from 'uuid';
const HL7Lookup = HL7Dictionary?.definitions['2.5.1'];

export interface Segment {
  uid: string;
  name: string;
  index: number;
  value?: string;
  description?: string;
  fields?: Field[];
}

export interface Field {
  uid: string;
  name: string;
  index?: number;
  value?: string;
  description?: string;
  components?: Field[];
}

export const parse = hl7 => {
  let segments = [''];
  if (hl7.indexOf('\r\n') !== -1) {
    segments = hl7.split('\r\n');
  } else {
    segments = hl7.split('\r');
    if (segments.length < 2) {
      segments = hl7.split('\n');
    }
  }

  return parseSegments(segments);
};

const parseSegments = segments => {
  const segmentList: Segment[] = [];
  segments.forEach((segment, index) => {
    const parsedSegment = parseSegment(segment, index + 1);
    segmentList.push(parsedSegment);
  });
  return segmentList;
};

const parseSegment = (segment, index) => {
  const fieldList: Field[] = [];
  let fields = segment.split('|');
  let segmentName = fields[0];
  if (segmentName === 'MSH') {
    //for MSH manually add the separator field
    fields.splice(1, 0, '|');
  }
  fields.forEach((field, fieldIndex) => {
    const fieldName = segmentName + '.' + fieldIndex;
    const parsedField = parseField(field, fieldName, segmentName, fieldIndex);

    //first value is the field name, so skip it
    if (fieldIndex !== 0) {
      fieldList.push(parsedField);
    }
  });
  const parsedSegment: Segment = {
    uid: uuidv4(),
    name: segmentName,
    index: index,
    description: HL7Lookup?.segments[segmentName]?.desc,
    fields: fieldList,
  };
  return parsedSegment;
};

const parseField = (selectedField, fieldName, segmentName, fieldIndex) => {
  const components = selectedField.split('^');
  let field: Field = {
    uid: uuidv4(),
    name: fieldName,
    description: HL7Lookup?.segments[segmentName]?.fields[fieldIndex - 1]?.desc,
  };
  if (components.length === 1) {
    field.value = components[0];
  } else {
    const componentFieldList = parseComponents(
      components,
      segmentName,
      fieldName,
      fieldIndex,
    );
    field.components = componentFieldList;
  }
  return field;
};

const parseComponents = (components, segmentName, fieldName, fieldIndex) => {
  const componentFieldList: Field[] = [];
  components.forEach((component, componentIndex) => {
    let parsedComponent: Field = {
      uid: uuidv4(),
      name: fieldName + '.' + (componentIndex + 1),
      description: getFieldDescription(segmentName, fieldIndex, componentIndex),
      value: component,
    };
    componentFieldList.push(parsedComponent);
  });
  return componentFieldList;
};

const getFieldDescription = (segmentName, fieldIndex, subFieldIndex?) => {
  const fieldDataType =
    HL7Lookup?.segments[segmentName]?.fields[fieldIndex - 1]?.datatype;

  if (!subFieldIndex) {
    subFieldIndex = 0;
  }
  const fieldDescription =
    HL7Lookup?.fields[fieldDataType]?.subfields[subFieldIndex]?.desc ||
    HL7Lookup?.fields[fieldDataType]?.desc;
  return fieldDescription;
};

/* 
const fieldRepetitionList = selectedField
    .split('~')
    .map((fieldRepetition, i) => ({
      fieldRepetitionIndex: i,
      fieldRepetitionNumber: i + 1,
      fieldRepetitionValue: fieldRepetition,
})); 
const parseSelectedComponent = selectedComponent => {
  const subcomponentList = selectedComponent.split('&');
  let subComponentFieldList: Field[] = [];
  for (const subComponent of subcomponentList) {
    const subComponentField: Field = {
      name: '',
      description: '',
      value: subComponent,
    };
    subComponentFieldList.push(subComponentField);
  }
  return subComponentFieldList;
};
*/
