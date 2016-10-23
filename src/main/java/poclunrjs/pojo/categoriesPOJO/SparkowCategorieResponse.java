package poclunrjs.pojo.categoriesPOJO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SparkowCategorieResponse {

    @JsonProperty("Header")
    private SparkowHeader sparkowHeader;

    @JsonProperty("Zones")
    private List<SparkowZone> sparkowZones = new ArrayList<SparkowZone>();

    public List<SparkowZone> getSparkowZones() {
        return sparkowZones;
    }

    public SparkowHeader getSparkowHeader() {
        return sparkowHeader;
    }
}
