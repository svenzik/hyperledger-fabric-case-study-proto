package main
import (
  "fmt"
  "os"
  "io/ioutil"
  // "encoding/hex"
)

func main() {
  argsWithoutProg := os.Args[1:]
  if len(argsWithoutProg) != 1 {
    fmt.Println("Use: bin2byte filepath")
    return
  }

  filepath := argsWithoutProg[0]
  filebytes, err := ioutil.ReadFile(filepath)
  if err != nil {
    fmt.Println("Cannot open file %s, use bin2byte filepath: %s", filepath, err)
    return
  }

  fmt.Printf("% x", filebytes)
  // fmt.Println(hex.EncodeToString(filebytes))
}
