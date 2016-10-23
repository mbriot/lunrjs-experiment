package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowFilter {

    @JsonProperty("AttributeDefinitionCode")
    private String code;

    @JsonProperty("FilterValues")
    private List<SparkowFilterValue> sparkowFilterValues = new ArrayList<>();

    public String getCode() {
        return code;
    }

    public List<SparkowFilterValue> getSparkowFilterValues() {
        return sparkowFilterValues;
    }
}
