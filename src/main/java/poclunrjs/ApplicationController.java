package poclunrjs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import poclunrjs.Util.TimeCounter;
import poclunrjs.pojo.CategoriePage;

import java.io.IOException;

@Controller
public class ApplicationController {

    @Autowired
    Categories categories;

    @RequestMapping("/list/{id}")
    public String listPage(@PathVariable(value = "id") String id, Model model) throws IOException {
        TimeCounter timeCounter = new TimeCounter();
        timeCounter.start();
        CategoriePage categoriePage = categories.getCategorieInformations(id);
        timeCounter.stop();
        categoriePage.setGenTime(timeCounter.getTime());
        model.addAttribute("categorie", categoriePage);
        return "listpage";
    }
}
