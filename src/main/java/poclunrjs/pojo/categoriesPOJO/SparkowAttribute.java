package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowAttribute {

    @JsonProperty("AttributeDefinitionCode")
    private String attributeDefinitionCode;

    @JsonProperty("Value")
    private String value;

    public String getAttributeDefinitionCode() {
        return attributeDefinitionCode;
    }

    public String getValue() {
        return value;
    }
}
